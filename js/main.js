if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

      var container, stats;

      var camera, scene, renderer, objects;
      var particleLight, pointLight;
      var dae;

      var clock = new THREE.Clock();
      var morphs = [];

      // Collada model

      var loader = new THREE.ColladaLoader();
      loader.options.convertUpAxis = true;
      loader.load( 'monster.dae', function ( collada ) {

        dae = collada.scene;

        dae.traverse( function ( child ) {

          if ( child instanceof THREE.SkinnedMesh ) {

            var animation = new THREE.Animation( child, child.geometry.animation );
            animation.play();

          }

        } );

        dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
        dae.position.x = -1;
        dae.updateMatrix();

        init();
        animate();

      } );

      function init() {

        container = document.createElement( 'div' );
        document.getElementById('3d').appendChild( container );

        camera = new THREE.PerspectiveCamera( 50, 500 / 500, 1, 2000 );
        camera.position.set( 2, 4, 5 );

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

        // Add Blender exported Collada model

        var loader = new THREE.JSONLoader();
        loader.load( 'monster.js', function ( geometry, materials ) {

          // adjust color a bit

          var material = materials[ 0 ];
          material.morphTargets = true;
          material.color.setHex( 0xffaaaa );

          var faceMaterial = new THREE.MeshFaceMaterial( materials );

          for ( var i = 0; i < 729; i ++ ) {

            // random placement in a grid

            var x = ( ( i % 27 )  - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );
            var z = ( Math.floor( i / 27 ) - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );

            // leave space for big monster

            if ( Math.abs( x ) < 2 && Math.abs( z ) < 2 ) continue;

            morph = new THREE.MorphAnimMesh( geometry, faceMaterial );

            // one second duration

            morph.duration = 1000;

            // random animation offset

            morph.time = 1000 * Math.random();

            var s = THREE.Math.randFloat( 0.00075, 0.001 );
            morph.scale.set( s, s, s );

            morph.position.set( x, 0, z );
            morph.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

            morph.matrixAutoUpdate = false;
            morph.updateMatrix();

            scene.add( morph );

            morphs.push( morph );

          }

        } );


        // Add the COLLADA

        scene.add( dae );

        // Lights

        scene.add( new THREE.AmbientLight( 0xcccccc ) );

        pointLight = new THREE.PointLight( 0xff4400, 5, 30 );
        pointLight.position.set( 5, 0, 0 );
        scene.add( pointLight );

        // Renderer

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( 500, 500 );
        container.appendChild( renderer.domElement );

        // Stats

        stats = new Stats();
        container.appendChild( stats.domElement );

        // Events

        window.addEventListener( 'resize', onWindowResize, false );

      }

      //

      function onWindowResize( event ) {

        renderer.setSize( 500, 500 );

        camera.aspect = 500 / 500;
        camera.updateProjectionMatrix();

      }

      //

      function animate() {

        requestAnimationFrame( animate );

        var delta = clock.getDelta();

        // animate Collada model

        THREE.AnimationHandler.update( delta );

        if ( morphs.length ) {

          for ( var i = 0; i < morphs.length; i ++ )
            morphs[ i ].updateAnimation( 1000 * delta );

        }

        render();
        stats.update();

      }

      function render() {

        var timer = Date.now() * 0.0005;

        camera.position.x = Math.cos( timer ) * 10;
        camera.position.y = 4;
        camera.position.z = Math.sin( timer ) * 10;

        camera.lookAt( scene.position );

        renderer.render( scene, camera );

      }