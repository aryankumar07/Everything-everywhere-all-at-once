#pragma once
#include "./ObserverInterface.h"
#include <vector>
using namespace std;

class ProductI {
public:
  virtual void addObserver(ObserverI *observer) = 0;
  virtual void removeObserver(ObserverI *observer) = 0;
  virtual void addProduct(string product) = 0;
  virtual void notifyUsers(string product) = 0;
};
