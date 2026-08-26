#include "./strategies/bubbleSort.cpp"
#include "./strategies/heapSort.cpp"
#include "sortingContext.cpp"

using namespace std;

int main() {
  SortingContext *context = new SortingContext();
  context->setStrategy(new BubbleSort());
  vector<int> vec = context->sort({1, 2, 3});
  context->setStrategy(new HeapSort());
  context->sort({1, 2, 3});
  for (auto num : vec) {
    cout << num << " ";
  }
  cout << endl;
  return 0;
}
