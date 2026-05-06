import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ChildObservationCreate({ child }: any) {
    useEffect(() => {
        router.replace(route('admin.children.observations.index', child.id));
    }, []);
    return null;
}
