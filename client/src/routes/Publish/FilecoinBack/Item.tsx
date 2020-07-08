import React from 'react'
import Moment from 'react-moment'
import Dotdotdot from 'react-dotdotdot'
import styles from './Item.module.scss'

const Item = ({
    item
}: {
    item: {
        url: string
        status: string
        lastUpdate: Date
        detail?: any
    }
}) => {
    let infoTitle
    if (item.detail) {
        infoTitle = JSON.stringify(item.detail)
    }
    return (
        <li title={infoTitle}>
            <span className={styles.linkUrl} title={item.url}>
                <Dotdotdot clamp={2}>{item.url}</Dotdotdot>
            </span>
            <div className={styles.details}>
                <span>Filecoin backup status: {item.status}</span>
                <span>
                    Last update:{' '}
                    <Moment
                        date={item.lastUpdate}
                        format="L LTS"
                        interval={0}
                    />
                </span>
            </div>
        </li>
    )
}

export default Item
