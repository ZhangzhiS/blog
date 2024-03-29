---
title: "Mysql Optimization"
date: 2019-04-25T16:26:50+08:00
categories: ['历史文章']
tags: ["历史文章"]
draft: false
---

昨天面试的时候，被问到有关于MySQL的优化方面的知识。回答了一些sql语句方面的优化，以及分表，对于MySQL数据库设计的方面回答也不是很完善，所以回来重新整理了一下这方面的知识。整理的比较片面，如果想要学习更深的东西，推荐阅读专业的书籍。

### 尽量遵循数据库设计范式

遵循设计范式，是为了能够建立冗余小，结构合理的数据库。最常见的设计范式有三个：



1. 第一范式：原子性

   原子性是需要遵循的最基本的范式了，就是需要保证每个字段是最小的不可拆分的。比如下面的用户表就是不符合原子性的，用户信息中的数据是可以继续拆分的：

   | id   | 用户名 | 用户信息 |
   | ---- | ------ | -------- |
   | 1    | 张三   | 男，25岁 |
   | 2    | 李四   | 男，30岁 |

   正确的设计应该是这样的：

   | id   | 用户名 | 性别 | 年龄 |
   | ---- | ------ | ---- | ---- |
   | 1    | 张三   | 男   | 25   |
   | 2    | 李四   | 男   | 30   |

   合理遵循第一范式，根据业务需求来确定合理的字段。

2. 第二范式：唯一性

   在一张表中，只说明一件事情，比如商品表，就只保存商品的信息，价格型号等，存在单一主键，非主键依赖于主键。

   拿之前的图片平台项目来举例，先看看下面这种结构：

   | 图集id | 图集 | 图片id | 图片  |      |
   | ------ | ---- | ------ | ----- | ---- |
   | 1      | 童年 | 1      | a.jpg |      |
   | 1      | 童年 | 2      | b.jpg |      |
   | 2      | 风景 | 3      | c.jpg |      |

   一个图集内会有多张图片，这样设计明显是不太合理的，一个图集有多张图片的话，一些字段会有大量的重复，再看看下面的：

   | 图集id | 图集 |
   | ------ | ---- |
   | 1      | 童年 |
   | 2      | 风景 |

   | 图片id | 图片  | 所属图集 |
   | ------ | ----- | -------- |
   | 1      | a.jpg | 1        |
   | 2      | b.jpg | 1        |
   | 3      | c.jpg | 2        |

   图集拆分成一个表，图片为一个表，很大程度上减少了数据库的冗余。

3. 第三范式：每列都依赖主键，不存在依赖传递。

   如下面的例子：

   用户表

   | 用户id | 用户名 |
   | ------ | ------ |
   | 1      | 张三   |

   图片表

   | 图片id | 用户id |
   | ------ | ------ |
   | 1      | 1      |
   | 2      | 1      |
   | 3      | 1      |
   | 4      | 1      |

   这样在查图片的时候可以根据用户id找到用户的信息。

### 索引

#### 为什么要建立索引呢

索引是为了能够快速查询到需要的数据。在MySQL中，索引的存储类型有两种”b-tree”和”HASH”。

举例来说：

我们的用户表有5W条数据，想要查询某个openid对应的用户信息，如果没有索引，那系统会遍历所有数据，直到找到对应的数据。如果建立了索引，可以查询索引的信息，快速的找到对应的数据。

#### 优缺点

- 优点：
  - 所有字段类型都可以建立索引。
  - 极大的加快的查询速度。
- 缺点：
  - 创建和维护索引都需要消耗时间，数据量越大，创建维护需要的时间也越久。
  - 索引的存储也需要占存储空间。
  - 每次进行数据库的增删改，索引也需要变化。

#### 使用原则

- 对经常更新的表避免创建过多的索引，比如用户表，一般情况下只需要对用户id创建索引就好了。
- 数据量小的表不一定需要创建索引，因为数据量少，就算遍历的速度都不见得会比查索引慢。

#### 索引的分类

介绍一下常用的三种索引：

- 普用索引：基本索引类型，没有什么限制，允许在定义索引的列中插入重复值和空值，纯粹为了查询数据更快一点。
- 唯一索引：创建索引的列的值必须是唯一的，但是允许空值。
- 主键索引：特殊的唯一索引，使用较多，不允许有空值。

其他的比如：全文索引，组合索引，空间索引等我没用过，就先不介绍了。

#### 创建索引

可以在创建表的时候就创建索引，这是创建索引的语句格式。

```
CREATE TABLE 表名[字段名 数据类型]  [UNIQUE|FULLTEXT|SPATIAL|...] [INDEX|KEY] [索引名字] (字段名[length]) 　　[ASC|DESC]
```

我自己的话，主要编程语言为Python，项目经验大部分为Django，所以介绍一下python创建索引。

使用Django框架的话，可以在需要创建索引的字段中添加可选参数`db_index=True`：

```
class Article(models.Model):
    # 使用db_index=True对title建立索引
    title = models.CharField('标题', max_length=200, db_index=True)
```

或者在class Meta中添加：

```
class Article(models.Model):
    """文章模型"""
    title = models.CharField('标题', max_length=200,)

    class Meta:
        indexes = [
            models.Index(fields=['title']),
        ]
```

使用sqlalchemy的话，在对应的字段中添加可选的`index=True`.

当然，如果不使用ORM，创建索引的方法与SQL语句是相同的。

### 查询过程中SQL的注意事项、

主要避免使用不合适的查询语句，造成数据库放弃使用索引而搜索全表。

比如：

- 避免在where语句中使用`！=`或者`<>`。
- 避免在where语句中对字段的值进行null判断。
- 避免使用`or`，使用`union all`来连接两条SQL。
- 避免使用`in`和`not in`，尽量使用`between`。

### 分表

分为水平分表和垂直分表：

- 水平分表：依据数据表的逻辑关系将同一个表中的数据按照某种条件拆分到多台数据库。比如根据用户年龄段或者地区进行拆分。
- 垂直分表：按照不同的表来且分到不同的数据库。

### 读写分离

- 应用服务器对master进行写的操作，同步数据，读取的时候读slave数据库。
- 通过MySQL-Proxy调度进行读写分离。

### MySQL配置优化

我自己了解的只有配置并发数，以及调整缓存大小。详细的配置文件可以看看这个帖子。

[MySQL配置及优化](https://www.cnblogs.com/zhshto/p/6653424.html)

