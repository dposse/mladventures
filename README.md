# The Machine Learning Adventures of Jojo and Junior

Based on a cart/pole game example on Tensorflow.js

The gist of the RL algorithm is:

1. Define a policy network to make decisions on moving left or moving right
   given the observed state of the system. The decision is not completely
   deterministic. Instead, it is a probability that is converted to the actual
   action by drawing random samples from binomial probability distribution.
2. For each "game", calculate reward values in such a way that longer-lasting
   games are assigned positive reward values, while shorter-lasting ones
   are assigned negative reward values.
3. Calculate the gradients of the policy network's weights with respect to the
   actual actions and scale the gradients with the reward values from step 2.
   The scale gradients are added to the policy network's weights, the effect of
   which is to make the policy network more likely to select actions that lead
   to the longer-lasting games given the same system states.

For a more detailed overview of policy gradient methods, see:
  http://www.scholarpedia.org/article/Policy_gradient_methods

## Usage

```sh
yarn && yarn watch
```
./serve.sh