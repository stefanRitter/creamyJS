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
    world: null,
    scale: 32, // one map tile = 1 meter
    PHYSICS_LOOP_HZ : 1.0 / 60.0,

    //-----------------------------------------
    setup: function () {
      gPhysicsEngine.world = new World(
          new Vec2(0, 9.8), // Gravity vector
          true              // allow sleep
      );

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
    update: function () {

      gPhysicsEngine.world.Step(
          gPhysicsEngine.PHYSICS_LOOP_HZ, //frame-rate
          8,                              //velocity iterations
          3                               //position iterations
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
    registerBody: function (bodyDef) {
      var body = gPhysicsEngine.world.CreateBody(bodyDef);
      return body;
    },

    //-----------------------------------------
    addBody: function (entityDef) {
      var bodyDef = new BodyDef(),
          fixtureDefinition = new FixtureDef(),
          body = null;

      if(entityDef.type == 'static') {
          bodyDef.type = Body.b2_staticBody;
      } else {
          bodyDef.type = Body.b2_dynamicBody;
      }

      bodyDef.position.x = entityDef.x;
      bodyDef.position.y = entityDef.y;
      bodyDef.linearDamping = entityDef.linearDamping || bodyDef.linearDamping;
      bodyDef.userData = entityDef.userData || null;

      body = this.registerBody(bodyDef);

      fixtureDefinition.density = entityDef.density || fixtureDefinition.density;
      fixtureDefinition.friction = entityDef.friction || fixtureDefinition.friction;
      fixtureDefinition.restitution = entityDef.restitution || fixtureDefinition.restitution;

      /*
      if(entityDef.useBouncyFixture) {
          fixtureDefinition.density = 1.0;
          fixtureDefinition.friction = 0;
          fixtureDefinition.restitution = 1.0;
      }
      */

      if (entityDef.shape) {
        fixtureDefinition.shape = entityDef.shape;

      } else if (entityDef.radius) {
        fixtureDefinition.shape = new CircleShape(entityDef.radius);

      } else {
        fixtureDefinition.shape = new PolygonShape();
        fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
      }

      body.CreateFixture(fixtureDefinition);

      return body;
    },

    //-----------------------------------------
    removeBody: function (obj) {
      gPhysicsEngine.world.DestroyBody(obj);
    },

    testEngine: function() {
      var debugDraw = new DebugDraw(),
          rect, circle, wall;

      debugDraw.SetSprite(gContext);
      debugDraw.SetDrawScale(gPhysicsEngine.scale);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      // show shapes and joints
      debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
      gPhysicsEngine.world.SetDebugDraw(debugDraw);

      /*
      rect = gPhysicsEngine.addBody( {
        x: 40/gPhysicsEngine.scale,
        y: 100/gPhysicsEngine.scale,
        halfWidth: 30/gPhysicsEngine.scale,
        halfHeight: 50/gPhysicsEngine.scale,
        type: 'dynamic',
        density: 1.0,
        friction: 0.5,
        restitution: 0.3
      });
      
      circle = gPhysicsEngine.addBody( {
        x: 130/gPhysicsEngine.scale,
        y: 100/gPhysicsEngine.scale,
        halfWidth: 30/gPhysicsEngine.scale,
        halfHeight: 50/gPhysicsEngine.scale,
        type: 'dynamic',
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
        radius: 32/gPhysicsEngine.scale
      });
      */
      wall = gPhysicsEngine.addBody( {
        x: 0,
        y: 32/gPhysicsEngine.scale,
        halfWidth: 30/gPhysicsEngine.scale,
        halfHeight: 600/gPhysicsEngine.scale,
        type: 'static'
      });

      wall = gPhysicsEngine.addBody( {
        x: 990/gPhysicsEngine.scale,
        y: 32/gPhysicsEngine.scale,
        halfWidth: 30/gPhysicsEngine.scale,
        halfHeight: 600/gPhysicsEngine.scale,
        type: 'static'
      });
      wall = gPhysicsEngine.addBody( {
        x: 1000/2/gPhysicsEngine.scale,
        y: 580/gPhysicsEngine.scale,
        halfWidth: 500/gPhysicsEngine.scale,
        halfHeight: 10/gPhysicsEngine.scale,
        type: 'static',
        friction: 1.0
      });
      wall = gPhysicsEngine.addBody( {
        x: 1000/2/gPhysicsEngine.scale,
        y: 20/gPhysicsEngine.scale,
        halfWidth: 1000/gPhysicsEngine.scale,
        halfHeight: 10/gPhysicsEngine.scale,
        type: 'static',
        friction: 1.0
      });
    }
  });

  window.gPhysicsEngine = new PhysicsEngineClass();
}).call(this);