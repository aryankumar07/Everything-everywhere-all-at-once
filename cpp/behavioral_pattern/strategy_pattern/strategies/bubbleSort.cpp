#include "../sortingStrategy.h"
#include <iostream>

class BubbleSort : public SortingStrategy {
public:
  vector<int> sort(vector<int> &arr) {
    cout << "Bubble sort called" << endl;
    return arr;
  }
};
