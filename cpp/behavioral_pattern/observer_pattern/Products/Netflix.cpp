#include "../headers/ObserverInterface.h"
#include "../headers/ProductInterface.h"
#include <algorithm>
#include <iostream>
#include <vector>

class Netflix : public ProductI {
private:
  vector<ObserverI *> list;
  vector<string> products;

public:
  void addObserver(ObserverI *observer) override {
    list.push_back(observer);
    cout << "Observer pushed to the list" << endl;
  }

  void removeObserver(ObserverI *observer) override {
    auto it = find(list.begin(), list.end(), observer);
    if (it != list.end()) {
      list.erase(it);
      cout << "erased observer" << endl;
    } else {
      cout << "No element found" << endl;
    }
  }

  void addProduct(string product) override {
    products.push_back(product);
    notifyUsers(product);
  }

  void notifyUsers(string product) override {
    for (auto observer : list) {
      observer->update(product);
    }
  }
};
