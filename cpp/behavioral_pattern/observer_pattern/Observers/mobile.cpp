#include "../headers/ObserverInterface.h"
#include <iostream>

class Mobile : public ObserverI {
public:
  string name;

  Mobile(string name) { this->name = name; }

  void update(string str) { display(str); }

  void display(string msg) {
    cout << this->name << " A new movie has been added " << msg << endl;
  }
};
