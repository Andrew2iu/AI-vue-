<template>
    <div>
        <PageHead title="知识文章">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">
                    新增
                </el-button>
            </template>
        </PageHead>
        <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
        <el-table :data="tableData" style="width: 100%; margin-top: 25px">
            <el-table-column width="250" label="文章标题" fixed="left">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon><Timer /></el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon><Timer /></el-icon>
                        <span>{{ categoryMap[scope.row.categoryId] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="authorName" label="作者" width="150" />
            <el-table-column prop="readCount" label="阅读量" width="150" />
            <el-table-column prop="updatedAt" label="发布时间" width="150" />
            <el-table-column label="操作" width="300" fixed="right">
                <template #default="scope">
                    <el-button
                        @click="handleEdit(scope.row)"
                        text
                        type="primary"
                        >编辑</el-button
                    >
                    <el-button
                        v-if="scope.row.status === 0 || scope.row.status === 2"
                        text
                        type="success"
                        @click="handlePublish(scope.row)"
                        >发布</el-button
                    >
                    <el-button
                        v-if="scope.row.status === 1"
                        text
                        type="warning"
                        @click="handleUnPublish(scope.row)"
                        >下线</el-button
                    >
                    <el-button
                        text
                        type="danger"
                        @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 25px"
            layout="prev, pager, next"
            :total="pagination.total"
            :page-size="pagination.size"
            @change="handleChange"
        />
        <ArticleDialog
            v-model:modelValue="dialogVisible"
            :categories="categroies"
            :success="handleSuccess"
            :article="currentArticle"
        />
    </div>
</template>
<script setup>
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { ref, onMounted, reactive, computed } from "vue";
import {
    categoryTree,
    articlePage,
    getArticleDetail,
    changeArticleStatus,
    deleteArticle,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";

const formItem = [
    {
        label: "文章标题",
        prop: "title",
        comp: "input",
        placeholder: "请输入文章标题",
    },
    {
        label: "分类",
        prop: "categoryId",
        comp: "select",
        placeholder: "请选择分类",
    },
    {
        label: "状态",
        prop: "status",
        comp: "select",
        placeholder: "请选择文章内容",
        options: [
            {
                label: "草稿",
                value: "0",
            },
            {
                label: "已发布",
                value: "1",
            },
            {
                label: "已下线",
                value: "2",
            },
        ],
    },
];
const pagination = reactive({
    total: 0,
    size: 10,
    currentPage: 1,
});
// 列表数据
const tableData = ref([]);
const handleSearch = async (formData) => {
    const params = {
        ...formData,
        ...pagination,
    };
    const { records, total } = await articlePage(params);
    pagination.total = total;
    tableData.value = records;
};

const handleChange = (val) => {
    pagination.currentPage = val;
    handleSearch();
};

const categoryMap = reactive({});
const categroies = ref([]);
// 新增和编辑
const dialogVisible = ref(false);

onMounted(async () => {
    // 获取分类列表
    const data = await categoryTree();
    categroies.value = data.map((item) => {
        categoryMap[item.id] = item.categoryName;
        return {
            label: item.categoryName,
            value: item.id,
        };
    });
    formItem[1].options = categroies.value;
    // 初始化列表
    handleSearch();
});

const handleSuccess = () => {
    dialogVisible.value = false;
    handleSearch();
};
const currentArticle = ref(null);
// 编辑
const handleEdit = (row) => {
    if (row.id) {
        getArticleDetail(row.id).then((res) => {
            currentArticle.value = res;
            dialogVisible.value = true;
        });
    } else {
        currentArticle.value = null;
        dialogVisible.value = true;
    }
};
// 上线
const handlePublish = (row) => {
    ElMessageBox.confirm(`确定上线${row.title}吗？`, "确认", {
        confirmButtonText: "确认上线",
        cancelButtonText: "取消",
        type: "info",
    }).then(() => {
        // 确认上线
        changeArticleStatus(row.id, { status: 1 }).then((res) => {
            ElMessage.success("上线成功");
            handleSearch();
        });
    });
};
//下线
const handleUnPublish = (row) => {
    ElMessageBox.confirm(`确定下线${row.title}吗？`, "确认", {
        confirmButtonText: "确认下线",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        // 确认下线
        changeArticleStatus(row.id, { status: 2 }).then((res) => {
            ElMessage.success("下线成功");
            handleSearch();
        });
    });
};
// 删除
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定删除${row.title}吗？`, "确认", {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "danger",
    }).then(() => {
        // 确认删除
        deleteArticle(row.id).then((res) => {
            ElMessage.success("删除成功");
            handleSearch();
        });
    });
};
</script>
<style lang="scss" scoped>
.page-head {
    margin-bottom: 20px;
}
</style>
