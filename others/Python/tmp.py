#!/usr/bin/env python3

import sys
import argparse
import uuid

parser = argparse.ArgumentParser()
parser.add_argument('--i', type=int, default=80)
parser.add_argument('--j', type=int, default=80)

args = parser.parse_args()
print(args.i+10)
print(args.j+20)

