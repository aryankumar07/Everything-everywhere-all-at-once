cmake_minimum_required(VERSION 3.20)

# Emit build/compile_commands.json so clangd knows the include paths,
# the C++ standard and the warning flags.
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

project("Adapter_Pattern"
    DESCRIPTION "Adapter pattern"
    LANGUAGES CXX
)

add_executable(${PROJECT_NAME}
  main.cpp
  legacyPrinter.cpp
  printerAdapter.cpp
  headers/legacyPrinter.h
  headers/printerAdapter.h
  headers/printerInterface.h
)

target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
