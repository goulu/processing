import traer.physics.*;

Particle body[];
ParticleSystem physics;

float pi=4*atan(1);

PImage img;
color col=color(255,255,192); // yellow stars
float cx; float cy; //center
float s=0;

void setup()
{
  size( 400, 400 );
  frameRate( 24 );
  tint( 255, 24 );
  background( 0 );

  // begin in the center
  cx = width/2;
  cy = height/2;
  
  physics = new ParticleSystem( 0, 0 );
  
  XMLElement xml = new XMLElement(this, "system.xml");
  
  int N = xml.getChildCount();
  body = new Particle[N];
  for (int i = 0; i < N; i++) {
    float x=0,y=0,z=0,vx=0,vy=0,vz=0,m=0;
    XMLElement b = xml.getChild(i);
    for (int j = 0; j < b.getChildCount(); j++) {
      XMLElement e = b.getChild(j);
      if (e.getName()=="PositionX") x=float(e.getContent()); 
      else if (e.getName()=="PositionY") y=float(e.getContent());
      else if (e.getName()=="PositionZ") z=float(e.getContent()); 
      else if (e.getName()=="VelocityX") vx=float(e.getContent()); 
      else if (e.getName()=="VelocityY") vy=float(e.getContent()); 
      else if (e.getName()=="VelocityZ") vz=float(e.getContent()); 
      else if (e.getName()=="Mass") m=float(e.getContent()); 
    }
    body[i] = physics.makeParticle( m,x,y,z );
    body[i].setVelocity(vx,vy,vz);
    float r=sqrt(x*x+y*y+z*z);
    if (r>s) s=r;
  }
  /*
  for ( int i = 0; i < body.length; i++ )
  {
    float a=random(0,2*pi);
    float r=random(2,Rmax);
    body[i] = physics.makeParticle( 1.0, cx+r*cos(a), cy+r*sin(a), 0 );
    float v=32/sqrt(r); // 32 for circular orbit
    body[i].setVelocity(-v*sin(a),v*cos(a),0);
    for ( int j = 0; j < i; j++ )
      physics.makeAttraction( body[i], body[j], 1, 10 ); 
  }
  //create the Sun
  body[0].moveTo(cx,cy,0);
  body[0].setMass(1000);
  */
  body[0].makeFixed();
  
  s=cy/s;
  
}

void draw()
{
  physics.tick(3600);

  background( 0 );
  stroke(col);
  for ( int i = 0; i < body.length; i++ )
  {
     Particle p = body[i];
     point(cx+s*p.position().x(),cy+s*p.position().y());
     //image(img,p.position().x(),p.position().y()-img.height/2);
  }
}


