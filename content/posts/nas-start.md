---
title: "家用NAS搭建记录"
date: 2021-03-25T16:39:51+08:00
categories: ['历史文章']
tags: ["历史文章"]
draft: false
---

最近陷入了存储焦虑的困境。我的手机120G内存已用117G，电脑256G的内存已用220G，女朋友的iPhone更有意思，APP还能根据使用频率自动卸载。

能怎么办，NAS搞起。有钱的选择当然是买成品的群辉或者威联通之类的了，但是从配置上来说，太缺少性价比了，所以选择自己搭建一台。

这里记录一下自己硬件选择以及搭建的流程。



如果在搭建过程中遇到什么问题，可以扫文章末尾的二维码备注”NAS“加我微信私聊问我。

## 硬件的选择

其实开始的时候家里有个树莓派4B，4G内存版的。我在上面就安装了OMV，外接了一个1T的机械硬盘使用。但是说实话，没敢用，害怕挂掉，硬盘是笔记本拆出来的机械盘。没有独立电源供电的硬盘盒，树莓派的USB接口的供电对于硬盘来说是不稳定的，随时准备宕机。

看了矿渣产品星际蜗牛，j1900的CPU，4盘位的机箱，但是考虑到我想在家里自己部署个gitlab以及其他一些服务，害怕这CPU会比较吃力，所以放弃了选择这个。

后来又看到了同样矿渣的暴风酷播云二期，J3455的cpu，性能会比J1900好个不少。所以从咸鱼淘到了一台二手的，价格比蜗牛星际贵不少，2盘位的机箱。

硬盘是西数的14T盘，暂时只买了一块，可以先使用这，等亚马逊活动的时候再入手一块组raid。现在的文件备份的话计划定时备份到OSS中。

## 系统的选择

机器本来是刷了黑群晖的，但是毕竟是破解的，不能升级，而且不确定稳定性，所以没准备使用了。

其他免费开源的NAS系统，我主要对比了TrueNas和OMV，从两者中选择了OMV。

### TrueNas（FreeNas）

优势：

- 默认使用zfs文件系统（可以自己了解一下优势）
- 插件库丰富

缺点：

- 对硬件要求比较高，官方推荐最低8G内存。
- 对于docker的支持不是很好（由于现在是基于FreeBSD的，不过有了基于Linux的分支，但是还不够完善）

### OMV

优势：

- 基于Debian系统，相关的文档比较多
- 硬件需求不高，树莓派都能跑
- Docker支持好

缺点：

- 界面没有TrueNas好看
- 需要实现的功能需要自己折腾
- zfs文件系统需要插件才能支持

*关于zfs文件系统，对于我来说不是必要的，我更希望docker支持好一点，可以自己实现更丰富的功能*

## 系统安装与配置

1. 下载系统镜像。
2. 将系统写入U盘，MacOS下使用`balenaEtcher`，Windows下使用rufus或者其他工具都可。
3. 进入BIOS，修改引导，选择U盘引导开机，然后安装即可。
4. 安装的时候使用默认的英语安装，使用中文安装之后会有乱码，可以安装好之后再修改系统语言为中文。

可以参考下面的链接，写的比较全。

[树莓派 配置 OMV 5 搭建 NAS（一） 安装 OMV 5](https://www.cnblogs.com/Yogile/p/12577321.html)

