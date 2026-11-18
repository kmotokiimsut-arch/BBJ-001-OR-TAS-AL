# BBJ-001-OR-TAS-AL

バイオバンク・ジャパン（BBJ）データを用いて、**味覚（TAS）・嗅覚（OR）・アルコール代謝（ADH/ALDH）関連遺伝子**と脳神経疾患（脳梗塞、脳動脈瘤・SAH、てんかん、認知症、ALS、脳出血）の関連を調べる研究。候補遺伝子 PheWAS とマルチオミックス統合解析を行う。

- 研究計画: [`docs/study_plan.md`](docs/study_plan.md)
- 計画の検討メモ: [`docs/study_plan_review.md`](docs/study_plan_review.md)
- 先行研究: [`docs/literature/literature_review.md`](docs/literature/literature_review.md)
- PubMed 検索: `python3 scripts/00_setup/pubmed_search.py "<query>"`

## ディレクトリ構成

```
.
├── config/            解析パラメータ（QC閾値・共変量・パス）
├── data/              ★Git管理外★ BBJ 個票データ置き場
│   ├── raw/           受領データ（読み取り専用として扱う）
│   ├── interim/       QC 途中ファイル
│   ├── processed/     解析用に整形済みのデータ
│   └── external/      公開データ（1000G, gnomAD, LD参照パネル等）
├── docs/              研究計画・データ利用申請メモ・文献調査
├── notebooks/         探索的解析
├── results/           ★Git管理外★ 解析結果（共有は集計値のみ）
├── scripts/
│   ├── 00_setup/      環境構築・参照データ取得
│   ├── 01_qc/         サンプル/バリアント QC
│   ├── 02_gwas/       関連解析（REGENIE / PLINK2 / SAIGE）
│   └── 03_post_gwas/  Fine-mapping, LDSC, MR, PRS 等
└── logs/              ★Git管理外★ 実行ログ
```

## 解析の流れ（予定）

1. データ利用承認・倫理審査承認の取得（`docs/data_access.md`）
2. 表現型定義（症例/対照・量的形質）と共変量の確定
3. QC：サンプル（コールレート, 性別不一致, 近縁, PCA外れ値）／バリアント（コールレート, HWE, MAF, INFO）
4. 候補遺伝子 × 6 疾患の関連解析（SAIGE / REGENIE。症例と対照の不均衡に対応）、TAS2R38 のハプロタイプ解析、WGS による遺伝子単位の希少バリアント検定
5. マルチオミックス：pQTL / mQTL、媒介分析、MR、colocalization
6. 結果公開：サマリー統計を JENGER / NBDC 等で公開

## データ取扱いの原則

- BBJ 個票データは**承認された解析環境内のみ**で扱い、本リポジトリには**一切コミットしない**（`.gitignore` で防御）。
- 外部へ出すのは集計値のみ。少数セル（例：n<10 など、利用規約に従う）は秘匿する。
- 利用規約（NBDC ヒトデータ共有ガイドライン／BBJ 試料・情報利用規約）を必ず確認すること。

## 環境

```bash
conda env create -f environment.yml
conda activate bbj-gwas
```
