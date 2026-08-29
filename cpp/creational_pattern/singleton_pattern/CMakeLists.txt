cmake_minimum_required(VERSION 3.20)
project(singelton_pattern
  VERSION 1.0
  DESCRIPTION "This is a singelton pattern"
  LANGUAGES CXX
)
add_executable(${PROJECT_NAME}
  main.cpp
  )

target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
