#include "../headers/pizzaDecoratorInterface.h"
#include <iostream>

class SauceDecorator : public PizzaDecorator {
public:
  SauceDecorator(PizzaI *pizza) : PizzaDecorator(pizza) {}
  void build() {
    pizza->build();
    std::cout << "adding a sauce layer" << std::endl;
  }
  int getCost() { return 3 + pizza->getCost(); }
};
