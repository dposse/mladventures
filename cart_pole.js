//leaving all comments since they are done so well....

/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/**
 * Implementation based on: http://incompleteideas.net/book/code/pole.c
 */

import * as tf from '@tensorflow/tfjs';
import gameConstants from './gameConstants';

/**
 * Cart-pole system simulator.
 *
 * In the control-theory sense, there are four state variables in this system:
 *
 *   - x: The 1D location of the cart.
 *   - xDot: The velocity of the cart.
 *   - theta: The angle of the pole (in radians). A value of 0 corresponds to
 *     a vertical position.
 *   - thetaDot: The angular velocity of the pole.
 *
 * The system is controlled through a single action:
 *
 *   - leftward or rightward force.
 */

// this will now be the board/player system

export class BoardPlayer {
  /**
   * Constructor of CartPole.
   */
  constructor() {
    // // Constants that characterize the system.
    // this.gravity = 9.8;
    // this.massCart = 1.0;
    // this.massPole = 0.1;
    // this.totalMass = this.massCart + this.massPole;
    // this.cartWidth = 0.2;
    // this.cartHeight = 0.1;
    // this.length = 0.5;
    // this.poleMoment = this.massPole * this.length;
    // this.forceMag = 10.0;
    // this.tau = 0.02;  // Seconds between state updates.

    // // Threshold values, beyond which a simulation will be marked as failed.
    // this.xThreshold = 2.4;
    // this.thetaThreshold = 12 / 360 * 2 * Math.PI;

    //above are constants for cartpole
    this.setInitialState();
  }

  /**
   * Set the state of the cart-pole system randomly.
   */

  // don't need to set random state
  setInitialState() {
    // // The control-theory state variables of the cart-pole system.
    // // Cart position, meters.
    // this.x = Math.random() - 0.5;
    // // Cart velocity.
    // this.xDot = (Math.random() - 0.5) * 1;
    // // Pole angle, radians.
    // this.theta = (Math.random() - 0.5) * 2 * (6 / 360 * 2 * Math.PI);
    // // Pole angle velocity.
    // this.thetaDot =  (Math.random() - 0.5) * 0.5;

    //board state is 2d array filled with 0's
    this.board = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    //player position is just a number, always on first row (array) of board
    this.playerPosition = gameConstants.INITIAL_PLAYER_POSITION;
    //want two empty rows between each tiled row => tickCounter % 3 === 0
    this.tickCounter = 0;
    console.log(this.board);
    console.log(gameConstants.INITIAL_BOARD_STATE);
  }

  /**
   * Get current state as a tf.Tensor of shape [1, 4].
   */
  getStateTensor() {
    // flatten board to one array and add player position
    console.log(this.board);
    const tensorArray = [...this.board[1]];
    tensorArray.push(this.playerPosition);
    // console.log('hi ', tensorArray);
    console.log('board[1]: ', [...this.board[1]]);
    console.log(`tensorArray: `, tensorArray);

    return tf.tensor2d([tensorArray]);
  }

  /** 
   * Update the cart-pole system using an action.
   * @param {number} action Only the sign of `action` matters.
   *   A value > 0 leads to a rightward force of a fixed magnitude.
   *   A value <= 0 leads to a leftward force of the same fixed magnitude.
   */
  update(action) {
    // const force = action > 0 ? this.forceMag : -this.forceMag;

    // const cosTheta = Math.cos(this.theta);
    // const sinTheta = Math.sin(this.theta);

    // const temp =
    //     (force + this.poleMoment * this.thetaDot * this.thetaDot * sinTheta) /
    //     this.totalMass;
    // const thetaAcc = (this.gravity * sinTheta - cosTheta * temp) /
    //     (this.length *
    //      (4 / 3 - this.massPole * cosTheta * cosTheta / this.totalMass));
    // const xAcc = temp - this.poleMoment * thetaAcc * cosTheta / this.totalMass;

    // // Update the four state variables, using Euler's metohd.
    // this.x += this.tau * this.xDot;
    // this.xDot += this.tau * xAcc;
    // this.theta += this.tau * this.thetaDot;
    // this.thetaDot += this.tau * thetaAcc;

    // here we do each tick of the game loop
    // update board
    this.board = this.updateBoard(this.board, this.tickCounter);

    // move player based on action
    if (action === 0) {
      this.playerPosition = this.moveRight(this.playerPosition);
    } else if (action === 1) {
      this.playerPosition = this.moveLeft(this.playerPosition);
    } 

    // in the future want 3 options instead of 2
    // else {
    //   //action is 0
    //   //no player movement - doesn't need an else now but leaving for clarity
    // }

    this.tickCounter++;
    console.log('action: ', action);
    // check for collision inside isDone()
    return this.isDone();
  }

  /**
   * Determine whether this simulation is done.
   *
   * A simulation is done when `x` (position of the cart) goes out of bound
   * or when `theta` (angle of the pole) goes out of bound.
   *
   * @returns {bool} Whether the simulation is done.
   */
  isDone() {
    console.log('board: ', JSON.stringify(this.board));
    console.log('player position: ', this.playerPosition);
    return (this.board[0][this.playerPosition] === 1);
  }


  /**
   * Update board every tick
   * @param {int[][]} currentBoard - previous board state
   * @param {int} counter - tick counter, game loop counter
   */
  updateBoard (currentBoard, counter) {
    //remove first row
    const newBoard = currentBoard.slice(1);      
  
    //add last row
    if (counter % 3 === 0) {
      newBoard.push(this.tileArray(gameConstants.WALL_SIZE));
    } else {
      newBoard.push(this.emptyArray(gameConstants.WALL_SIZE));
    }
  
    return newBoard;
  };

  tileArray(size) {
    let array;
    let impossible;

    do {
      array = [];
      for (let i=0; i<size; i++) {
        array.push(Math.round(Math.random()));
      }
      // for now saying that any array with an open space is possible. all 1's clearly impossible
      impossible = array.reduce((acc, curr) => {
        if (curr === 0) {
          return false;
        }
        return acc;
      }, true);
    } while (impossible);
    
    return array;
  };
  
  emptyArray(size) {
    const array = [];
    for (let i=0; i<size; i++) {
      array.push(0);
    }
    return array;
  };

  /**
   * Range of movement is 0 to WALL_SIZE - 1
   * @param {int} currentPosition 
   */
  moveLeft (currentPosition) {
    return (currentPosition === 0) ? 0 : currentPosition - 1;
  }
  
  moveRight (currentPosition) {
    return (currentPosition === (gameConstants.WALL_SIZE - 1)) ? (gameConstants.WALL_SIZE - 1) : currentPosition + 1;
  }
}
