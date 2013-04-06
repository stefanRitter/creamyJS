// global short-hands for Box2D primitives
window.Vec2 = Box2D.Common.Math.b2Vec2;
window.BodyDef = Box2D.Dynamics.b2BodyDef;
window.Body = Box2D.Dynamics.b2Body;
window.FixtureDef = Box2D.Dynamics.b2FixtureDef;
window.Fixture = Box2D.Dynamics.b2Fixture;
window.World = Box2D.Dynamics.b2World;
window.MassData = Box2D.Collision.Shapes.b2MassData;
window.PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
window.CircleShape = Box2D.Collision.Shapes.b2CircleShape;
window.DebugDraw = Box2D.Dynamics.b2DebugDraw;
window.RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


function addCircle() {
  // create a fixed circle - this will have an image in it
  // create basic circle
  var bodyDef = new BodyDef();
  var fixDef = new FixtureDef();
  fixDef.density = 0.5;
  fixDef.friction = 0.1;
  fixDef.restitution = 0.2;
   
  bodyDef.type = Body.b2_dynamicBody;
  scale = Math.floor(Math.random()*40) + 8;
  fixDef.shape = new CircleShape(scale);

  bodyDef.position.x = scale*2;
  bodyDef.position.y = scale*2;

  var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function init() {
         
    //create ground
    var fixDef = new FixtureDef();
    fixDef.density = 0.5;
    fixDef.friction = 0.4;
    fixDef.restitution = 0.2;
    var bodyDef = new BodyDef();
    bodyDef.type = Body.b2_staticBody;
    fixDef.shape = new PolygonShape();
    fixDef.shape.SetAsBox(canvaswidth/2,2);
    bodyDef.position.Set(canvaswidth/2, 0);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(canvaswidth/2, canvasheight -2);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    for (var i  = 0; i < 10; i ++) {
      addCircle();
    }
  }

window.onload = function() {


  var canvas = document.getElementById('my_canvas');
  canvas.width = 600;
  canvas.height = 400;
  window.gContext = canvas.getContext('2d');


  // Define the world
  var gravity = new Vec2(0, -10);
  var doSleep = true;
  var world = new World(gravity, doSleep);
  var deletionBuffer = 4;

  var debugDraw = new DebugDraw();

  debugDraw.SetSprite(gContext);
  debugDraw.SetDrawScale(1);
  debugDraw.SetFillAlpha(0.3);
  debugDraw.SetLineThickness(1.0);
  // show shapes and joints
  debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);



  requestAnimationFrame(animate);

  function animate() {
    requestAnimationFrame(animate);

    world.Step(
          1/60, //frame-rate
          10,                              //velocity iterations: 8
          10                              //position iterations: 3
      );

    world.DrawDebugData();
  }
};*/