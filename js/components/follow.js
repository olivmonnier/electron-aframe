AFRAME.registerComponent('follow', {
  schema: {
    target: {type: 'selector'},
    axis: {type: 'string', default: 'xyz'},
    speed: {type: 'number'}
  },
  init: function () {
    this.directionVec3 = new THREE.Vector3();
  },
  tick: function (time, timeDelta) {
    var axis = this.data.axis.split('');
    var directionVec3 = this.directionVec3;
    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.data.target.object3D.position;
    var currentPosition = this.el.object3D.position;
    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);
    // Calculate the distance.
    var distance = directionVec3.length();
    // Don't go any closer if a close proximity has been reached.
    if (distance < 1) { return; }
    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.data.speed / distance;
    ['x', 'y', 'z'].forEach(function (axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });
    // Translate the entity in the direction towards the target.
    this.el.setAttribute('position', {
      x: (axis.indexOf('x') >= 0) ? currentPosition.x + directionVec3.x : currentPosition.x,
      y: (axis.indexOf('y') >= 0) ? currentPosition.y + directionVec3.y : currentPosition.y,
      z: (axis.indexOf('z') >= 0) ? currentPosition.z + directionVec3.z : currentPosition.z
    });
  }
});
