
// import processing.core.*;
import java.util.*;

import traer.physics.*;
import traer.animation.*;

import org.htmlparser.*;
import org.htmlparser.util.*;
import org.htmlparser.filters.*;
import org.htmlparser.nodes.*;
import org.htmlparser.tags.*;


/*******************************************************************************
 * 
 * Sitemap : Web crawler and graph builder
 * 
 * Authors : Marcel Salathe (salathe.marcel@gmail.com http://www.aharef.info/static/htmlgraph/) 
 * Philippe Guglielmetti (drgoulu@gmail.com www.drgoulu.com)
 * 
 * 
 * Libraries:
 * - http://htmlparser.sourceforge.net/
 * - http://www.cs.princeton.edu/~traer/physics/
 * - http://www.cs.princeton.edu/~traer/animation/
 * 
 *******************************************************************************/

final float NODE_SIZE = 20;
final float EDGE_LENGTH = 25;
final float EDGE_STRENGTH = 0.2f;
final float EDGE_DAMPING = 0.2f;
final float SPACER_STRENGTH = 2000;

final String GRAY = "155,155,155";
final String BLUE = "0,0,155";
final String ORANGE = "255,155,51";
final String YELLOW = "255,255,51";
final String RED = "255,0,0";
final String GREEN = "0,155,0";
final String VIOLET = "204,0,255";
final String BLACK = "0,0,0";

HashMap pagesbyparticle = new HashMap(); // of pages indexed by particle
HashMap pagesbyurl = new HashMap(); // of pages indexed by url
  
ParticleSystem physics;
Smoother3D centroid;

class Link{
  Spring s;
  int count; // number of duplicates of this link
  Link(Page from, Page to){
    count=1;
    s=physics.makeSpring(from.p, to.p, EDGE_STRENGTH, EDGE_DAMPING, EDGE_LENGTH );  
  }
  void Inc(){
    ++count;
    s.setRestLength(EDGE_LENGTH*count);
    s.setStrength(EDGE_STRENGTH/count);
  }
  Particle getOther(Particle p){
    if (p==s.getOneEnd()) {return s.getTheOtherEnd();}
    if (p==s.getTheOtherEnd()) {return s.getOneEnd();}
    return null; // mistake ...
  }
}

class Page {
  String url;
  int count; // number of incoming links
  HashMap links= new HashMap(); // of Links indexed by url
  Particle p = physics.makeParticle();

  Page(String u) {
    url=u;
    count=0;
  };

  void addLink(Page from) {
    // see if link is a duplicate
    Link l=(Link)links.get(from.url);
    if (l==null) { // create it
      l=new Link(from,this);
      l.count=0;
       // add it in both directions
      links.put(from.url,l);
      
      from.links.put(url,l);
      // add "spacers" to repell other linked nodes
      Set entries = from.links.entrySet();
      for (Iterator it = entries.iterator(); it.hasNext();) {
        Map.Entry entry = (Map.Entry)it.next();
        Link d = (Link)entry.getValue();
        Particle o=d.getOther(from.p);
        if (o!=p) {
          physics.makeAttraction(o,p, -SPACER_STRENGTH, 20);
        }
      }
    }  
    
    l.Inc(); // increment the link weight
    count++; // and the weight of the node (duplicate links are counted...)
        
    if (count==1) { // place the particle randomly around "from" page
      float angle =  random(0,2*PI);
      p.position().set( from.p.position().x() +EDGE_LENGTH*cos(angle), from.p.position().y() + EDGE_LENGTH*sin(angle), 0 );
    }
  }
}

class WebSite {
  String baseurl;
    
  WebSite(String url){
    baseurl=url;
  }
  
  // override the following method in derived classes
  Page AddPage(String url){
    if (!Contains(url)) {return null;}
    println(url+" [ URL=\""+url+"\"];");
    Page p=new Page(url);
    pagesbyurl.put(url,p);
    pagesbyparticle.put(p.p,p);
    return p;
  }
  
  boolean Contains(String href){
    return href.startsWith(baseurl);
  }
}

class WebCrawler implements Runnable{
  LinkedList sites = new LinkedList(); // of WebSite
  LinkedList pagestoparse = new LinkedList(); // of Page
  org.htmlparser.Parser ps = new org.htmlparser.Parser ();
  
  WebSite AddSite(String url) {
    WebSite w=new WebSite(url);
    sites.add(w);
    Page p=w.AddPage(url); // base page
    pagestoparse.add(p);
    return w;
  }

  void ParsePage(Page page, Node node) {
    if (node == null) return;
    String nodeText = node.getText();
    if (node instanceof LinkTag)  {   
      String href=((LinkTag)node).extractLink();
      // see if page is already known
      Page dest=(Page)pagesbyurl.get(href);
      Iterator it = sites.iterator(); 
      while (dest==null && it.hasNext()) {
        WebSite w=(WebSite)it.next();
        dest=w.AddPage(href);
        if (dest!=null) {pagestoparse.add(dest);}
      }
      if (dest!=null){
        dest.addLink(page); 
        // links are stored on the destination page to count references easily
      } 
    }
    NodeList children = node.getChildren();
    if (children == null) return;
    SimpleNodeIterator iter = children.elements();
    while(iter.hasMoreNodes()) {
      Node child = iter.nextNode();
      ParsePage(page, child);
    }
  }

  void run() {
    while (!pagestoparse.isEmpty()) {
      try {
        Page p = (Page)pagestoparse.getFirst();
        ps.setURL(p.url);
        OrFilter orf = new OrFilter();
        NodeFilter[] nfls = new NodeFilter[1];
        nfls[0] = new TagNameFilter("html");
        orf.setPredicates(nfls);
        NodeList nList  = ps.parse(orf);
        Node node = nList.elementAt (0);
        ParsePage(p,node);
        pagestoparse.removeFirst();
      }
      catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
}

WebCrawler crawler;
Thread crawlThread;

public void setup() {
  size(750, 750);
  smooth();
  strokeWeight(2);
  ellipseMode(CENTER);
  physics = new ParticleSystem( );
  physics.clear();
  centroid = new Smoother3D( 0.0f, 0.0f, 1.0f, 0.8f );
  loop();

  crawler = new WebCrawler();
  crawler.AddSite("http://drgoulu.com");
  crawlThread=new Thread(crawler);
  crawlThread.start();
}

public void draw() {
  try {
    physics.tick( 0.1f );
    if (physics.numberOfParticles() > 1) {
      updateCentroid();
    }
    centroid.tick();
    background(255);
    translate(width/2, height/2);
    scale(centroid.z());
    translate( -centroid.x(), -centroid.y() );
    drawNetwork();
  }
  catch (Exception e) {} // any problem ? just ignore it ;-)
}

void drawNetwork() {
  // draw edges
  stroke( 0 );
  beginShape( LINES );
  for ( int i = 0; i < physics.numberOfSprings(); ++i ){
    Spring e = physics.getSpring( i );
    Particle a = e.getOneEnd();
    Particle b = e.getTheOtherEnd();
    vertex( a.position().x(), a.position().y() );
    vertex( b.position().x(), b.position().y() );
  }
  endShape();
  // draw vertices
  noStroke();
  for ( int i = 0; i < physics.numberOfParticles(); ++i ) {
    Particle v = physics.getParticle(i);
    // Page p = (Page)(pagesbyparticle.get(v));
    fill(155);
    ellipse( v.position().x(), v.position().y(), NODE_SIZE, NODE_SIZE );
  }
}

void updateCentroid() {
  float
    xMax = Float.NEGATIVE_INFINITY,
  xMin = Float.POSITIVE_INFINITY,
  yMin = Float.POSITIVE_INFINITY,
  yMax = Float.NEGATIVE_INFINITY;

  for (int i = 0; i < physics.numberOfParticles(); ++i) {
    Particle p = physics.getParticle(i);
    xMax = max(xMax, p.position().x());
    xMin = min(xMin, p.position().x());
    yMin = min(yMin, p.position().y());
    yMax = max(yMax, p.position().y());
  }
  float deltaX = xMax-xMin;
  float deltaY = yMax-yMin;
  if ( deltaY > deltaX ) {
    centroid.setTarget(xMin + 0.5f*deltaX, yMin + 0.5f*deltaY, height/(deltaY+50));
  }
  else {
    centroid.setTarget(xMin + 0.5f*deltaX, yMin + 0.5f*deltaY, width/(deltaX+50));
  }
}










