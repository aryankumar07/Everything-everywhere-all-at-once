#include <iostream>
#include <string>
#include <vector>
using namespace std;

class SqlQuery {
private:
  std::string table;
  std::vector<std::string> column;
  std::vector<std::string> conditions;
  std::string orderBy;
  std::string limit;

  SqlQuery(string table, vector<string> &column, vector<string> &conditions,
           string orderBy, string limit)
      : table(table), column(column), conditions(conditions), orderBy(orderBy),
        limit(limit) {}

public:
  void execute() {
    cout << "select ";
    for (int i = 0; i < this->column.size(); i++) {
      cout << this->column[i];
      if (i < this->column.size() - 1)
        cout << ", ";
    }
    cout << "from " << this->table << " ";
    cout << "where" << " ";
    for (auto str : this->conditions)
      cout << str << " and ";
    cout << "orderby " << this->orderBy << " ";
    cout << "limit " << this->limit << endl;
  }

  class Builder {
  private:
    std::string table;
    std::vector<std::string> column;
    std::vector<std::string> conditions;
    std::string orderBy;
    std::string limit;

  public:
    Builder(string table) : table(table) {}

    Builder *withColumn(vector<string> &column) {
      this->column = column;
      return this;
    }

    Builder *withConditions(vector<string> &conditions) {
      this->conditions = conditions;
      return this;
    }

    Builder *withOrderBy(string orderBy) {
      this->orderBy = orderBy;
      return this;
    }

    Builder *withLimit(string limit) {
      this->limit = limit;
      return this;
    }

    SqlQuery *build() {
      return new SqlQuery(this->table, this->column, this->conditions,
                          this->orderBy, this->limit);
    }
  };
};
