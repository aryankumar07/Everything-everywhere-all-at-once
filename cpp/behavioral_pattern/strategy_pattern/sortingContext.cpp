#include "sortingStrategy.h"

class SortingContext {
private:
  SortingStrategy *strategy;

public:
  void setStrategy(SortingStrategy *sortingstrategy) {
    strategy = sortingstrategy;
  }

  vector<int> sort(vector<int> arr) { return strategy->sort(arr); }
};
