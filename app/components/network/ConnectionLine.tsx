import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface ConnectionLineProps {
    start: [number, number, number];
    end: [number, number, number];
    type: 'active' | 'past';
    isMeConnection?: boolean;
}

export function ConnectionLine({ start, end, type, isMeConnection }: ConnectionLineProps) {
    const points = useMemo(() => [
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
    ], [start, end]);

    const color = useMemo(() => {
        if (isMeConnection) return '#06b6d4'; // Bright Cyan for "Me" links
        return type === 'active' ? '#a855f7' : '#444444';
    }, [isMeConnection, type]);

    const opacity = useMemo(() => {
        if (isMeConnection) return 1.0;
        return type === 'active' ? 0.6 : 0.1;
    }, [isMeConnection, type]);

    const lineWidth = useMemo(() => {
        if (isMeConnection) return 2.5;
        return type === 'active' ? 1.5 : 0.5;
    }, [isMeConnection, type]);

    return (
        <Line
            points={points}
            color={color}
            lineWidth={lineWidth}
            transparent
            opacity={opacity}
            dashed={type === 'active' || isMeConnection}
            dashScale={2}
            dashSize={0.5}
            gapSize={0.2}
        />
    );
}
