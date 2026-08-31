#include "./decorators/cheesseDecorator.cpp"
#include "./decorators/sauceDecorator.cpp"
#include "./decorators/toppingsDecorator.cpp"
#include "./pizza.cpp"
#include "headers/pizzaInterface.h"
using namespace std;

int main() {
  Pizza *pizza = new Pizza();
  pizza->build();
  int cost = pizza->getCost();
  cout << cost << endl;
  cout << "----------------------------------------------------" << endl;
  PizzaI *cheesePizza = new CheeseDecorator(pizza);
  cheesePizza->build();
  cost = cheesePizza->getCost();
  cout << cost << endl;
  cout << "----------------------------------------------------" << endl;
  PizzaI *cheeseSaucePizza = new SauceDecorator(cheesePizza);
  cheeseSaucePizza->build();
  cost = cheeseSaucePizza->getCost();
  cout << cost << endl;
  cout << "----------------------------------------------------" << endl;
  PizzaI *extraToppings = new ToppingsDecorator(cheeseSaucePizza);
  extraToppings->build();
  cost = extraToppings->getCost();
  cout << cost << endl;
  cout << "----------------------------------------------------" << endl;
  return 0;
}
