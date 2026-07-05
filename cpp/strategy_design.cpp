#include <iostream>
using namespace std;

class NavigationStrategy {
public:
  virtual void direction() = 0;
  virtual void eta() = 0;
  virtual ~NavigationStrategy() { cout << "deleting navigation" << endl; }
};

class TrainStrategy : public NavigationStrategy {
public:
  void direction() override {
    cout << "This the Direction from Train strategy" << endl;
  }

  void eta() override { cout << "This is the Eta for TrainStrategy" << endl; }
};

class AirplaneStrategy : public NavigationStrategy {
public:
  void direction() override {
    cout << "This the Direction from Airplane strategy" << endl;
  }

  void eta() override { cout << "This is the Eta for Airplane" << endl; }
};

class ShipStrategy : public NavigationStrategy {
public:
  void direction() override {
    cout << "This the Direction from Ship strategy" << endl;
  }

  void eta() override { cout << "This is the Eta for Airplane" << endl; }
};

class Navigation {
private:
  NavigationStrategy *strategy;

public:
  Navigation(NavigationStrategy *strategy) : strategy(strategy) {}

  void setNavigation(NavigationStrategy *strategy) {
    this->strategy = strategy;
  }

  void getDirection() { strategy->direction(); }

  void getEta() { strategy->eta(); }
};

int main() {
  Navigation *navigation = new Navigation(new TrainStrategy());
  navigation->getDirection();
  navigation->getEta();

  navigation->setNavigation(new AirplaneStrategy());
  navigation->getDirection();
  navigation->getEta();

  return 0;
}
