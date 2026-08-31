#include "../headers/pizzaDecoratorInterface.h"
#include <iostream>

class CheeseDecorator : public PizzaDecorator {
public:
  CheeseDecorator(PizzaI *pizza) : PizzaDecorator(pizza) {}
  void build() {
    pizza->build();
    std::cout << "adding a cheese layer" << std::endl;
  }
  int getCost() { return 2 + pizza->getCost(); }
};
