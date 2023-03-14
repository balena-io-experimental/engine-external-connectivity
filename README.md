# `external connectivity` error reproduction

Attempted reproduction for `driver failed programming external connectivity on endpoint... port is already allocated` balenaEngine error.

The hypothesis with this reproduction is that containers getting removed & recreated may trigger the error.