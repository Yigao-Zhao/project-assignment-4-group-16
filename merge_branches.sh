#!/bin/bash

# 定义分支名称
BRANCH_ZHENBANG="zhenbang"
BRANCH_YIGAO="yigao"
BRANCH_LICHAO="lichao"
BRANCH_MAIN="main"

# 获取最新代码
echo "Fetching all branches..."
git fetch origin

# 切换到 zhenbang 分支并合并 yigao 和 lichao
echo "Switching to $BRANCH_ZHENBANG branch..."
git checkout $BRANCH_ZHENBANG

echo "Merging $BRANCH_YIGAO into $BRANCH_ZHENBANG..."
git merge origin/$BRANCH_YIGAO --no-edit || { echo "Merge conflict while merging $BRANCH_YIGAO into $BRANCH_ZHENBANG. Please resolve manually."; exit 1; }

echo "Merging $BRANCH_LICHAO into $BRANCH_ZHENBANG..."
git merge origin/$BRANCH_LICHAO --no-edit || { echo "Merge conflict while merging $BRANCH_LICHAO into $BRANCH_ZHENBANG. Please resolve manually."; exit 1; }

# 推送更新到远程 zhenbang
echo "Pushing changes to $BRANCH_ZHENBANG..."
git push origin $BRANCH_ZHENBANG || { echo "Failed to push $BRANCH_ZHENBANG. Please check your permissions or network."; exit 1; }

# 切换到 main 分支并合并 zhenbang
echo "Switching to $BRANCH_MAIN branch..."
git checkout $BRANCH_MAIN

echo "Merging $BRANCH_ZHENBANG into $BRANCH_MAIN..."
git merge origin/$BRANCH_ZHENBANG --no-edit || { echo "Merge conflict while merging $BRANCH_ZHENBANG into $BRANCH_MAIN. Please resolve manually."; exit 1; }

# 推送更新到远程 main
echo "Pushing changes to $BRANCH_MAIN..."
git push origin $BRANCH_MAIN || { echo "Failed to push $BRANCH_MAIN. Please check your permissions or network."; exit 1; }

# 切换到 yigao 分支并合并 main
echo "Switching to $BRANCH_YIGAO branch..."
git checkout $BRANCH_YIGAO

echo "Merging $BRANCH_MAIN into $BRANCH_YIGAO..."
git merge origin/$BRANCH_MAIN --no-edit || { echo "Merge conflict while merging $BRANCH_MAIN into $BRANCH_YIGAO. Please resolve manually."; exit 1; }

# 推送更新到远程 yigao
echo "Pushing changes to $BRANCH_YIGAO..."
git push origin $BRANCH_YIGAO || { echo "Failed to push $BRANCH_YIGAO. Please check your permissions or network."; exit 1; }

# 切换到 lichao 分支并合并 main
echo "Switching to $BRANCH_LICHAO branch..."
git checkout $BRANCH_LICHAO

echo "Merging $BRANCH_MAIN into $BRANCH_LICHAO..."
git merge origin/$BRANCH_MAIN --no-edit || { echo "Merge conflict while merging $BRANCH_MAIN into $BRANCH_LICHAO. Please resolve manually."; exit 1; }

# 推送更新到远程 lichao
echo "Pushing changes to $BRANCH_LICHAO..."
git push origin $BRANCH_LICHAO || { echo "Failed to push $BRANCH_LICHAO. Please check your permissions or network."; exit 1; }

echo "All branches have been successfully merged and synchronized!"