import firebase from 'firebase/app';
import { Chart, ChartWorkflow } from 'reducers/charts';

export class ChartService {
  private readonly firebaseCollection: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >;

  constructor(tenant: string) {
    this.firebaseCollection = firebase
      .firestore()
      .collection('tenants')
      .doc(tenant)
      .collection('charts');
  }

  async getCharts(): Promise<Chart[]> {
    const snapshot = await this.firebaseCollection.get();
    return snapshot.docs.map((doc) => doc.data()) as Chart[];
  }

  async saveChart(chart: Chart): Promise<void> {
    return this.firebaseCollection.doc(chart.id).set(chart);
  }

  async deleteChart(chart: Chart): Promise<void> {
    this.firebaseCollection.doc(chart.id).delete();
  }

  async setWorkflowsOnChart(
    chartId: string,
    workflowCollection: ChartWorkflow[]
  ): Promise<boolean> {
    await this.firebaseCollection.doc(chartId).update({ workflowCollection });
    return true;
  }
}

export default ChartService;
