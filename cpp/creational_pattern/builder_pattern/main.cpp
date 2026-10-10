#include "./sqlBuilder.cpp"
#include <iostream>
#include <vector>
using namespace std;

int main() {
  cout << "Builder pattern" << endl;
  vector<string> columns = {"*"};
  vector<string> conditions = {"age > 30"};
  SqlQuery *query = SqlQuery::Builder("users")
                        .withColumn(columns)
                        ->withConditions(conditions)
                        ->withOrderBy("desc")
                        ->withLimit("5")
                        ->build();

  query->execute();
  return 0;
}
