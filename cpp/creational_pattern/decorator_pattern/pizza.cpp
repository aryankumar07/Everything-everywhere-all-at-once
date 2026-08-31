#include "headers/pizzaInterface.h"
#include <iostream>
class Pizza : public PizzaI {
public:
  void build() { std::cout << "Your base pizza is ready" << std::endl; }
  int getCost() { return 4; }
};
