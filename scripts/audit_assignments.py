"""Execute every assignment reference answer against every hidden test.

The Node wrapper loads the real TypeScript assignment content. Each test gets a
fresh namespace, matching the browser grader and preventing function leakage.
"""

import contextlib
import io
import json
import sys
import traceback

import numpy as np
import pandas as pd


def execute(reference, test_code):
    namespace = {"np": np, "pd": pd}
    stdout = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout):
            exec(compile(reference, "<assignment>", "exec"), namespace, namespace)
            exec(compile(test_code, "<hidden-test>", "exec"), namespace, namespace)
        lines = [line.strip() for line in stdout.getvalue().splitlines() if line.strip()]
        return lines[-1] if lines else "(no output)", ""
    except Exception:
        return stdout.getvalue().strip(), traceback.format_exc(limit=1)


def main():
    assignments = json.load(sys.stdin)["assignments"]
    failures = []
    test_count = 0
    variant_count = 0
    assignment_ids = []

    for assignment in assignments:
        assignment_id = assignment.get("id", "")
        assignment_ids.append(assignment_id)
        for field in ("title", "summary", "functionSignature", "starter", "reference", "reviewPath"):
            if not assignment.get(field, "").strip():
                failures.append((assignment_id, f"EMPTY {field}", "non-empty content", ""))
        if assignment.get("lesson") not in (1, 2, 3, 4, 5):
            failures.append((assignment_id, "LESSON", "an L1 lesson from 1 to 5", assignment.get("lesson")))

        variants = assignment.get("variants", [])
        variant_count += len(variants)
        if not 2 <= len(variants) <= 3:
            failures.append((assignment_id, "VARIANT COUNT", "2 or 3", len(variants)))

        for variant in variants:
            key = f"{assignment_id}/{variant.get('id', '')}"
            if not variant.get("description", "").strip():
                failures.append((key, "DESCRIPTION", "non-empty description", ""))
            tests = variant.get("tests", [])
            if not tests:
                failures.append((key, "TEST COUNT", "at least one test", 0))
            for test in tests:
                test_count += 1
                test_key = f"{key}/{test.get('name', '')}"
                actual, error = execute(assignment.get("reference", ""), test.get("code", ""))
                expected = test.get("expected", "").strip()
                if not expected:
                    failures.append((test_key, "EXPECTED OUTPUT", "non-empty expected output", expected))
                elif error or actual != expected:
                    failures.append((test_key, "REFERENCE ANSWER", expected, actual))
                    if error:
                        failures.append((test_key, "PYTHON ERROR", "no error", error.strip()))

    if len(assignment_ids) != len(set(assignment_ids)):
        failures.append(("ASSIGNMENTS", "DUPLICATE ID", "unique IDs", assignment_ids))

    print(
        f"Audited {len(assignments)} assignments, {variant_count} variants "
        f"and {test_count} hidden tests"
    )
    print(f"Failures: {len(failures)}")
    for key, kind, expected, actual in failures:
        print(f"\n[{key}] {kind}\nEXPECTED: {expected!r}\nACTUAL:   {actual!r}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
