#!/bin/bash

# Run program 3 times and calculate average
total=0

for i in {1..3}; do
    start=$(date +%s.%N)
    node parseCsv.js "$1" # Run the program with all arguments passed to script
    end=$(date +%s.%N)
    runtime=$(echo "$end - $start" | bc)
    total=$(echo "$total + $runtime" | bc)
    echo "Run $i: $runtime seconds"
done

avg=$(echo "scale=3; $total / 3" | bc)
echo "Average runtime: $avg seconds"