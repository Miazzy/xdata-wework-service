# xdata-wework-service

### Development

```bash
$ npm i       // 安装依赖
$ npm run dev // 启动项目(调试)
```

### Deploy

```bash
$ npm start  // 启动项目
$ npm stop   // 停止项目
```

### MySQL backup user info

- 备份脚本
```# 执行备份脚本
/root/mysqldump/backupmysql.sh;

# 执行备份数据版本控制
cd /root/backups/mysql;
git add . ; git commit -m 'init';

# 提交备份数据至git仓库
git push --force;
```

- 备份参数
```
DBNAMES[0]="jeecg-boot" # databases you want to backup, separated by a space; leave empty to backup all databases on this host
DBUSER[0]="mysqldumpuser"  # MySQL username
DBPASS[0]="mysqldumpuser"  # MySQL password
DBHOST[0]="172.18.254.95"  # your MySQL server's location (IP address is best)
DBPORT[0]="3309"  # MySQL port
DBTABLES[0]="" # tables you want to backup or exclude, separated by a space; leave empty to back up all tables
DBTABLESMATCH[0]="include" # include will backup ONLY the tables in DBTABLES, exclude will backup all tables BUT those in DBTABLES
DBOPTIONS[0]="--quick --single-transaction"
```

### etcd install shell
```js
ETCD_VER=v3.4.14

# choose either URL
GOOGLE_URL=https://storage.googleapis.com/etcd
GITHUB_URL=https://github.com/etcd-io/etcd/releases/download
DOWNLOAD_URL=${GITHUB_URL}

rm -f /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz
rm -rf /tmp/etcd && mkdir -p /tmp/etcd

curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz
tar xzvf /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz -C /tmp/etcd --strip-components=1
rm -f /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz

/tmp/etcd/etcd --version
/tmp/etcd/etcdctl version
```

```yml
version: '2'
networks:
  byfn:

services:
  etcd1:
    image: quay.io/coreos/etcd
    container_name: etcd1
    command: etcd -name etcd1 -advertise-client-urls http://0.0.0.0:2379 -listen-client-urls http://0.0.0.0:2379 -listen-peer-urls http://0.0.0.0:2380 -initial-cluster-token etcd-cluster -initial-cluster "etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380" -initial-cluster-state new
    ports:
      - 2379
      - 2380
    networks:
      - byfn

  etcd2:
    image: quay.io/coreos/etcd
    container_name: etcd2
    command: etcd -name etcd2 -advertise-client-urls http://0.0.0.0:2379 -listen-client-urls http://0.0.0.0:2379 -listen-peer-urls http://0.0.0.0:2380 -initial-cluster-token etcd-cluster -initial-cluster "etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380" -initial-cluster-state new
    ports:
      - 2379
      - 2380
    networks:
      - byfn

  etcd3:
    image: quay.io/coreos/etcd
    container_name: etcd3
    command: etcd -name etcd3 -advertise-client-urls http://0.0.0.0:2379 -listen-client-urls http://0.0.0.0:2379 -listen-peer-urls http://0.0.0.0:2380 -initial-cluster-token etcd-cluster -initial-cluster "etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380" -initial-cluster-state new
    ports:
      - 2379
      - 2380
    networks:
      - byfn
```
