#include "../headers/pizzaDecoratorInterface.h"
#include <iostream>

class ToppingsDecorator : public PizzaDecorator {
public:
  ToppingsDecorator(PizzaI *pizza) : PizzaDecorator(pizza) {}
  void build() {
    pizza->build();
    std::cout << "adding extra toppings layer" << std::endl;
  }
  int getCost() { return 1 + pizza->getCost(); }
};
