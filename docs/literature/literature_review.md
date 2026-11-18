# 先行研究レビュー：味覚・嗅覚・アルコール代謝関連遺伝子と脳神経疾患

検索日: 2026-11-18（PubMed / NCBI E-utilities。再検索は `scripts/00_setup/pubmed_search.py`）
※ 抄録・書誌情報レベルで確認したもの。引用前に全文を確認すること。

---

## 1. 味覚受容体遺伝子（TAS2R38 ほか）

| 文献 | 対象 | 要点 | 本研究への示唆 |
|---|---|---|---|
| Su CW et al. *Front Aging Neurosci* 2026 (PMID [41858791](https://pubmed.ncbi.nlm.nih.gov/41858791/); medRxiv 版 41256155) | ADNI / ROSMAP / NACC（欧米） | TAS2R38 の supertaster は加齢に伴う AD リスクが低い。nontaster アレルは脳で **MGAM** の発現を上げる（eQTL）。MGAM 阻害薬（アカルボース・ミグリトール）の服用者は CDR の進行が緩やか | 計画書でいう「リポジショニング」の根拠論文。**日本人での再現**と、**BBJ の服薬情報（α-GI）× TAS2R38 遺伝型**の解析が有望 |
| Joseph PV et al. *Sci Rep* 2024 (PMID [39284855](https://pubmed.ncbi.nlm.nih.gov/39284855/)) | アフリカ系米国人 | 味覚関連遺伝子の SNP が AD と関連 | 非欧米集団でも関連あり。日本人は未報告 |
| Yamaki M et al. *J Nutr Sci Vitaminol* 2023 (PMID [37940575](https://pubmed.ncbi.nlm.nih.gov/37940575/)) | 東北メディカル・メガバンク 2KJPN（n=2,047） | 日本人の TAS2R38 アレル頻度は **AVI 0.42 / PAV 0.58**。まれなハプロタイプ（AAV, AVV など）も存在。遺伝型と飲酒頻度・野菜摂取に関連なし（欧米と異なる） | ハプロタイプ単位（PAV/AVI）で解析すべき。欧米で見られた嗜好との関連は日本人で弱い可能性 |
| Cossu G et al. *Mov Disord* 2018 (PMID [29575306](https://pubmed.ncbi.nlm.nih.gov/29575306/)) | パーキンソン病 | PROP 味覚障害と TAS2R38 nontaster 型が関連 | 神経変性疾患全般への拡張の根拠 |

**ギャップ:** 日本人の大規模集団で TAS2R38 と脳神経疾患の関連を調べた報告は見つからなかった → 本研究の主要な新規性。

## 2. 嗅覚機能・嗅覚受容体（OR）遺伝子

| 文献 | 要点 |
|---|---|
| Devanand DP et al. *Neurology* 2015 (PMID [25471394](https://pubmed.ncbi.nlm.nih.gov/25471394/)) | 嗅覚識別能の低下が認知機能低下と AD 発症を予測（地域コホート） |
| Windon MJ et al. *Laryngoscope* 2020 (PMID [31271464](https://pubmed.ncbi.nlm.nih.gov/31271464/)); Sun GH et al. 2012 SR (PMID [22552846](https://pubmed.ncbi.nlm.nih.gov/22552846/)); Liao W et al. *Ageing Res Rev* 2024 (PMID [39127444](https://pubmed.ncbi.nlm.nih.gov/39127444/)) | 嗅覚障害は認知症の早期マーカー（レビュー） |
| 日本人: Kouzuki M et al. *Neurol Sci* 2018 (PMID [29128987](https://pubmed.ncbi.nlm.nih.gov/29128987/)); Fukumoto T et al. DESK study 2022 (PMID [36531966](https://pubmed.ncbi.nlm.nih.gov/36531966/)) | 日本人の AD・MCI で嗅覚・味覚障害。**遺伝子レベルの検討はない** |
| Förster F et al. *Nat Commun* 2025 (PMID [40593737](https://pubmed.ncbi.nlm.nih.gov/40593737/)); Imtiaz MA et al. *BMC Genom Data* 2025 (PMID [40963118](https://pubmed.ncbi.nlm.nih.gov/40963118/)) | 嗅覚識別能・嗅覚障害の GWAS メタ解析（性特異的な座位を含む）。**ここで報告された座位を候補バリアントとして使える** |
| Shaw CA et al. *Neurology* 2011 (PMID [21482944](https://pubmed.ncbi.nlm.nih.gov/21482944/)) | OR 遺伝子のコピー数が AD の発症年齢と関連 |
| Young JM et al. *AJHG* 2008 (PMID [18674749](https://pubmed.ncbi.nlm.nih.gov/18674749/)); Hasin Y et al. *PLoS Genet* 2008 (PMID [18989455](https://pubmed.ncbi.nlm.nih.gov/18989455/)) | OR 遺伝子群はコピー数多型（CNV）・分離偽遺伝子（segregating pseudogene）が非常に多い → **SNP アレイやインピュテーションでは捉えにくい** |

**ギャップ:** 日本人での OR 遺伝子と疾患の関連はほぼ未報告。ただしこの領域は技術的な難所（後述）。

## 3. アルコール代謝遺伝子（ALDH2 rs671 / ADH1B rs1229984）

### 認知症・AD
| 文献 | 要点 |
|---|---|
| Wang X et al. *Nat Commun* 2024 (PMID [38519490](https://pubmed.ncbi.nlm.nih.gov/38519490/)) | 中国の剖検脳 469 例。rs671 はアミロイド斑や Aβ40/42 比を増やすが、**AD の独立した危険因子ではない** |
| Seike T et al. *Front Aging Neurosci* 2023 (PMID [37693648](https://pubmed.ncbi.nlm.nih.gov/37693648/)) | ALDH2*2 × 飲酒と AD のレビュー（メタ解析は関連を支持） |
| Ueno M et al. *J Alzheimers Dis* 2022 (PMID [35404279](https://pubmed.ncbi.nlm.nih.gov/35404279/)); Chen J et al. 2019 meta (PMID [30984100](https://pubmed.ncbi.nlm.nih.gov/30984100/)) | 日本人を含むメタ解析。結果は一貫していない |
| Tokiya M et al. *Environ Health Prev Med* 2024 (PMID [39401906](https://pubmed.ncbi.nlm.nih.gov/39401906/)) | 日本人。rs671 が MCI のリスクを上げる（横断研究） |

### 脳卒中・脳動脈瘤・てんかん
| 文献 | 要点 |
|---|---|
| Millwood IY et al. *Lancet* 2019 (PMID [30955975](https://pubmed.ncbi.nlm.nih.gov/30955975/)) | China Kadoorie Biobank（50万人）。rs671 / rs1229984 を使った MR で、飲酒は脳卒中、特に**脳出血**のリスクを用量依存的に上げる |
| Im PK et al. *Nat Med* 2023 (PMID [37291211](https://pubmed.ncbi.nlm.nih.gov/37291211/)) | 同コホートで 200 以上の疾患を対象にした遺伝学的解析 → **PheWAS 型デザインの先行例** |
| Hisamatsu T et al. *J Atheroscler Thromb* 2024 (PMID [37612092](https://pubmed.ncbi.nlm.nih.gov/37612092/)) | 日本人。飲酒と脳の小血管病・大血管病の MR |
| Chen X et al. *J Stroke* 2025 (PMID [40494582](https://pubmed.ncbi.nlm.nih.gov/40494582/)) | 中国人。ALDH2 変異が脳動脈瘤の破裂リスクを下げる可能性 |
| Lin CH et al. *J Transl Med* 2021 (PMID [34051793](https://pubmed.ncbi.nlm.nih.gov/34051793/)) | ADH1B × 飲酒と脳出血 |
| Yang H et al. *PLoS One* 2014 (PMID [25313998](https://pubmed.ncbi.nlm.nih.gov/25313998/)) | rs671 と脳卒中後てんかん、血漿 4-HNE |
| Jennings MV et al. *EBioMedicine* 2024 (PMID [38580523](https://pubmed.ncbi.nlm.nih.gov/38580523/)) | 300 万人規模で飲酒関連バリアントの PheWAS と MR |

## 4. BBJ 自体の先行研究（重複確認に必須）

| 文献 | 内容 | 本研究との関係 |
|---|---|---|
| Nagai A et al. *J Epidemiol* 2017 (PMID [28189464](https://pubmed.ncbi.nlm.nih.gov/28189464/)) | BBJ 第1コホート概要。**対象 47 疾患**、約 20 万人 | 疾患定義の基本文献 |
| Hirata M et al. *J Epidemiol* 2017 (PMID [28190660](https://pubmed.ncbi.nlm.nih.gov/28190660/)) | 32 疾患の追跡（生存）データ | 横断研究に加えて生存解析も可能 |
| **Matoba N et al. *Nat Hum Behav* 2020** (PMID [31959922](https://pubmed.ncbi.nlm.nih.gov/31959922/)) | BBJ 16.5 万人で飲酒を含む食習慣の GWAS。ADH1B, ALDH2, ALDH1B1, ALDH1A1 などを同定し、**PheWAS で多面的効果を報告済み** | **ALDH2/ADH1B × 疾患の PheWAS は BBJ で一部実施済み**。差別化が必要 |
| **Sakaue S et al. *Nat Genet* 2021** (PMID [34594039](https://pubmed.ncbi.nlm.nih.gov/34594039/)) | BBJ の 220 形質の GWAS（UKB・FinnGen とメタ解析）。サマリー統計は公開済み | **申請前に、公開サマリー統計で候補 SNP をすぐ確認できる** |
| Kojima N et al. *Stroke* 2025 (PMID [40135360](https://pubmed.ncbi.nlm.nih.gov/40135360/)); Dofuku S et al. 2023 (PMID [35701560](https://pubmed.ncbi.nlm.nih.gov/35701560/)) | BBJ の脳卒中 PRS、頭蓋内動脈狭窄の GWAS と PheWAS | 脳血管疾患の表現型定義の参考 |

### 日本人の認知症・ALS ゲノム研究（BBJ 外。再現・比較用）
- Shigemizu D et al. *Transl Psychiatry* 2021 (PMID [33654092](https://pubmed.ncbi.nlm.nih.gov/33654092/))：日本人 AD の GWAS / 同 *Mol Psychiatry* 2022 (PMID [35264725](https://pubmed.ncbi.nlm.nih.gov/35264725/))：WGS で希少バリアント / Kikuchi M 2024 (PMID [38414085](https://pubmed.ncbi.nlm.nih.gov/38414085/))：日本人 AD の PRS / Cao H et al. 2026 (PMID [41700061](https://pubmed.ncbi.nlm.nih.gov/41700061/))：東アジア AD
- Nakamura R et al. *Commun Biol* 2020 (PMID [32968195](https://pubmed.ncbi.nlm.nih.gov/32968195/))：日本人を含む ALS 多民族メタ解析（JaCALS）

---

## 5. まとめ：新規性がどこにあるか

| 遺伝子群 | 既報の量（日本人） | 新規性 | コメント |
|---|---|---|---|
| TAS2R38 / TAS2R | ほぼなし | **高** | Su 2026 の日本人での再現、MGAM・α-GI の視点。最も打ち出しやすい |
| OR ファミリー | ほぼなし | 高（技術的には難しい） | CNV・偽遺伝子の問題。WGS が前提 |
| ALDH2 / ADH1B | 多い（BBJ でも PheWAS 済み） | 中〜低 | オミクスによる媒介、希少バリアント、交互作用、MR で差別化する |
