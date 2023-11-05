import React from 'react'

export default function Service({ params }: { params: { slug: string } }) {
    return (
        <div>{params.slug}</div>
    )
}
