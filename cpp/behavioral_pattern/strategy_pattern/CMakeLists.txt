cmake_minimum_required(VERSION 3.20)

project(strategy_pattern
    VERSION 1.0
    DESCRIPTION "Strategy pattern demo with pluggable sorting algorithms"
    LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
add_executable(strategy_pattern
    main.cpp
    sortingContext.cpp
    strategies/bubbleSort.cpp
    strategies/heapSort.cpp
)
target_include_directories(strategy_pattern PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_options(strategy_pattern PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra -Wpedantic>
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
)
