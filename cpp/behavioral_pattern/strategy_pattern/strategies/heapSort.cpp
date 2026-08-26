#include "../sortingStrategy.h"
#include <iostream>

class HeapSort : public SortingStrategy {
public:
  vector<int> sort(vector<int> &arr) {
    cout << "Heap sort called" << endl;
    return arr;
  }
};
