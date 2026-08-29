#pragma once
#include <string>
using namespace std;

class ObserverI {
public:
  virtual void update(string msg) = 0;
};
