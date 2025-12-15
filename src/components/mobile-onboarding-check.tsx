"use client";

import { useEffect, useState } from "react";

export function MobileOnboardingCheck() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return null;
}
