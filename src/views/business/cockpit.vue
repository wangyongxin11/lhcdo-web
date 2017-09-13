<template>
    <div class="row-style">
        <Row :gutter="16">
            <Col span="4">
                <Card>
                    <p slot="title">无边框卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
            </Col>
            <Col span="4">
                <Card>
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
            </Col>
            <Col span="8">
                <Card>
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
            </Col>
        </Row>

        <div style="margin-top: 20px">
            <Row :gutter="16">
                <Col span="16">
                <Card style="height: 476px">
                    <p slot="title">无边框卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
                </Col>
                <Col span="8">
                <Card style="margin: 0 0 16px 0">
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
                <Card style="margin: 0 0 16px 0">
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
                <Card style="margin: 0 0 16px 0">
                    <p slot="title">使用阴影效果的卡片</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                    <p>卡片内容</p>
                </Card>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
    .row-style{
        margin: 10px 20px;
    }
</style>