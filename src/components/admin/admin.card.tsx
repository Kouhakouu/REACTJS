'use client'

import { Card, Col, Row } from "antd";

const AdminCard = () => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
                <Card title="Card title" bordered={false}>
                    Card content
                </Card>
            </Col>
            <Col xs={24} sm={8}>
                <Card title="Card title" bordered={false}>
                    Card content
                </Card>
            </Col>
            <Col xs={24} sm={8}>
                <Card title="Card title" bordered={false}>
                    Card content
                </Card>
            </Col>
        </Row>
    )
}

export default AdminCard;