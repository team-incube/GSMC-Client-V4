# Red flags

If you catch yourself doing any of these, **stop and return to Phase 1.**

## In your own reasoning

- "Quick fix for now, investigate later"
- "Let me just try changing X and see"
- Changing several things, then checking
- "It's probably X" without evidence
- Proposing fixes before tracing the data flow
- "I don't fully understand, but this might work"
- "One more attempt" after two have failed
- Each fix reveals a new problem in a different place

## In the user's replies

- "그게 아니라", "아직 안 돼" — you assumed without verifying
- "확인해봤어?", "로그 찍어봐" — you should have gathered evidence first
- "추측하지 말고" — you are proposing fixes without understanding
- Frustration that you are going in circles — your approach is not working

## Rationalizations to reject

| Excuse | Reality |
|---|---|
| "Simple issue, no need for process" | Simple issues have root causes too, and the process is fast for them |
| "No time, just fix it" | Guess-and-check thrashing is slower than investigating |
| "Multiple fixes at once saves time" | You cannot tell which one worked, and they cause new bugs |
| "I see the problem" | Seeing the symptom is not understanding the cause |
