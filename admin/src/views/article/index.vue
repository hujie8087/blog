<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="文章列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="createArticle" :icon="CirclePlus">新增文章</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="updateArticle(scope.row._id)">编辑</el-button>
        <el-button type="primary" link @click="deleteAccount(scope.row)" :icon="Delete">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="articleList">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { getArticleList, delArticle, changeArticleStatus } from "@/api/modules/article/article";
import { Article } from "@/api/interface/article";
import router from "@/routers";
import dayjs from "dayjs";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getArticleList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getArticleList(newParams);
};

const getArticleStatus = [
  {
    label: "启用",
    value: 1
  },
  {
    label: "禁用",
    value: 0
  }
];
// 表格配置项
const columns: ColumnProps<Article.Article>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "title",
    label: "标签标题",
    search: { el: "input" }
  },
  {
    prop: "articleCover",
    label: "图片",
    render: scope => {
      return (
        <>
          {scope.row.articleCover ? <el-image src={"api" + scope.row.articleCover} style="width: 100px; height: 100px;" /> : "--"}
        </>
      );
    }
  },
  {
    prop: "summary",
    label: "文章描述",
    search: { el: "input" }
  },
  {
    prop: "articleTag",
    label: "文章标签",
    search: { el: "input" }
  },
  {
    prop: "articleReadNum",
    label: "阅读数量",
    render: scope => {
      <>
        <el-tag type="danger">{scope.row.articleReadNum}</el-tag>
      </>;
    }
  },
  {
    prop: "commentNum",
    label: "评论数量",
    render: scope => {
      <>
        <el-tag type="danger">{scope.row.commentNum}</el-tag>
      </>;
    }
  },
  {
    prop: "sort",
    label: "排序"
  },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 200,
    render: scope => {
      return <>{scope.row.createdAt ? dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") : "--"}</>;
    }
  },
  {
    prop: "status",
    label: "标签状态",
    enum: getArticleStatus,
    search: { el: "tree-select", props: { filterable: true } },
    render: scope => {
      return (
        <>
          <el-switch
            v-model={scope.row.status}
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text={scope.row.status ? "启用" : "禁用"}
            active-value={1}
            inactive-value={0}
            before-change={() => changeStatus(scope.row)}
          ></el-switch>
        </>
      );
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

const createArticle = () => {
  router.push(`/article/create`);
};

const updateArticle = (id: string) => {
  router.push(`/article/create?id=${id}`);
};

const changeStatus = async (row: Article.Article) => {
  await useHandleData(
    changeArticleStatus,
    { id: row._id, status: row.status === 0 ? 1 : 0 },
    `切换【${row.title}】文章状态`
  ).then(() => {
    proTable.value.getTableList();
  });
};

// 删除角色信息
const deleteAccount = async (params: Article.Article) => {
  await useHandleData(delArticle, params._id, `删除【${params.title}】文章`);
  proTable.value.getTableList();
};
</script>
