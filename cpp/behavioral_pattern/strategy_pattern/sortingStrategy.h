#pragma once

#include <vector>

using namespace std;

class SortingStrategy {
public:
  virtual vector<int> sort(vector<int> &arr) = 0;
  virtual ~SortingStrategy() = default;
};
