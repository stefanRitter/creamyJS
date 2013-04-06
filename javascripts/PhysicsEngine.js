/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 *  
 *  PhysicsEngineClass based on Udacity game dev course: 
 *  https://www.udacity.com/course/cs255
 *
 *  PhysicsEngineClass uses Box2D by Erin Catto:
 *  http://box2d.org/
 *
 *  shared under the Creative Commons CC BY-NC-SA license:
 *  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 */

(function() {

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

  var PhysicsEngineClass = Class.extend({
    stateTime: 0,
    world: null,
    scale: 32, // one map tile = 1 meter

    //-----------------------------------------
    setup: function () {
      // Setup the box2d World that will do most of they physics calculation
      var gravity = new Vec2(0,9.8);
      var allowSleep = true;

      gPhysicsEngine.world = new World(gravity, allowSleep);


      // Add collision listeners
      gPhysicsEngine.addContactListener( {
        PostSolve: function (bodyA, bodyB, impulse) {
          var uA = bodyA ? bodyA.GetUserData() : null,
              uB = bodyB ? bodyB.GetUserData() : null;

          if (uA) {
            if (uA.ent && uA.ent.onTouch) {
                uA.ent.onTouch(bodyB, impulse);
            }
          }

          if (uB) {
            if (uB.ent && uB.ent.onTouch) {
                uB.ent.onTouch(bodyA, impulse);
            }
          }
        },

        EndContact: function (bodyA, bodyB) {
          var uA = bodyA ? bodyA.GetUserData() : null,
              uB = bodyB ? bodyB.GetUserData() : null;

          if (uA) {
            if (uA.ent && uA.ent.onEndContact) {
                uA.ent.onEndContact();
            }
          }

          if (uB) {
            if (uB.ent && uB.ent.onEndContact) {
                uB.ent.onEndContact();
            }
          }
        }
      });

      // gPhysicsEngine.testEngine();
    },

    //-----------------------------------------
    update: function (deltaTime) {

      var timestamp = deltaTime/1000;
      if (timestamp > 2/60) timestamp = 2/60;

      gPhysicsEngine.world.Step(
          timestamp,                 //frame-rate
          8,                         //velocity iterations
          3                          //position iterations
      );
      gPhysicsEngine.world.ClearForces();

      // gPhysicsEngine.world.DrawDebugData();
    },

    //-----------------------------------------
    addContactListener: function (callbacks) {
      var listener = new Box2D.Dynamics.b2ContactListener();

      if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
          callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                              contact.GetFixtureB().GetBody(),
                              impulse.normalImpulses[0]);
      };

      if (callbacks.BeginContact) listener.BeginContact = function (contact) {
          callbacks.BeginContact(contact.GetFixtureA().GetBody(),
                                 contact.GetFixtureB().GetBody());
      };

      if (callbacks.EndContact) listener.EndContact = function (contact) {
          callbacks.EndContact(contact.GetFixtureA().GetBody(),
                               contact.GetFixtureB().GetBody());
      };

      gPhysicsEngine.world.SetContactListener(listener);
    },

    //-----------------------------------------
    addBody: function (entityDef) {
      var bodyDef = new BodyDef(),
          fixtureDefinition = new FixtureDef(),
          body = null;

      if(entityDef.type === 'static') {
          bodyDef.type = Body.b2_staticBody;
      } else {
          bodyDef.type = Body.b2_dynamicBody;
      }

      bodyDef.position.x = entityDef.x/gPhysicsEngine.scale;
      bodyDef.position.y = entityDef.y/gPhysicsEngine.scale;

      bodyDef.userData = entityDef.userData || null;

      fixtureDefinition.density = entityDef.density || 1.0;
      fixtureDefinition.friction = entityDef.friction || 0.5;
      fixtureDefinition.restitution = entityDef.restitution || 0.7;

      if (entityDef.shape) {
        fixtureDefinition.shape = entityDef.shape;

      } else if (entityDef.radius) {
        fixtureDefinition.shape = new CircleShape(entityDef.radius/gPhysicsEngine.scale);

      } else {
        fixtureDefinition.shape = new PolygonShape();
        fixtureDefinition.shape.SetAsBox(entityDef.halfWidth/gPhysicsEngine.scale,
          entityDef.halfHeight/gPhysicsEngine.scale);
      }

      body = gPhysicsEngine.world.CreateBody(bodyDef);
      body.CreateFixture(fixtureDefinition);

      return body;
    },

    //-----------------------------------------
    removeBody: function (obj) {
      gPhysicsEngine.world.DestroyBody(obj);
    },

    testEngine: function() {
      var debugDraw = new DebugDraw();

      debugDraw.SetSprite(gContext);
      debugDraw.SetDrawScale(gPhysicsEngine.scale);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      // show shapes and joints
      debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
      gPhysicsEngine.world.SetDebugDraw(debugDraw);

      gPhysicsEngine.createCircularBody();
      gPhysicsEngine.createCircularBody3();
    }
  });

  window.gPhysicsEngine = new PhysicsEngineClass();
}).call(this);