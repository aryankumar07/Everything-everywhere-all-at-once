#include "../headers/ObserverInterface.h"
#include <iostream>

class Console : public ObserverI {
public:
  string name;
  Console(string name) { this->name = name; }

  void update(string str) { display(str); }

  void display(string msg) {
    cout << this->name << " A new movie has been added " << msg << endl;
  }
};
