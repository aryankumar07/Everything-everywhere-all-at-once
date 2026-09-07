#pragma once

#include <iostream>
using namespace std;

class Person {
public:
  void moveLeft() { cout << "MOVE LEFT" << endl; }
  void moveRight() { cout << "MOVE RIGHT" << endl; }
  void jump() { cout << "JUMPING" << endl; }
  void duck() { cout << "DUCK" << endl; }
  void kick() { cout << "KICK" << endl; }
};
