cmake_minimum_required(VERSION 3.20)
project(Observer_pattern
  VERSION 1
  LANGUAGES CXX
)
add_executable(${PROJECT_NAME} 
  main.cpp
  ./Products/Netflix.cpp
  ./Observers/console.cpp
  ./Observers/desktop.cpp
  ./Observers/mobile.cpp
)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
