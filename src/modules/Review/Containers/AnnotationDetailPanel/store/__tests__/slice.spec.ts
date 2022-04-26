import reducer, {
  annotationDetailPanelInitialState,
  AnnotationDetailPanelState,
  selectCategory,
} from 'src/modules/Review/Containers/AnnotationDetailPanel/store/slice';
import { Categories } from 'src/modules/Review/types';
import { deselectAllSelectionsReviewPage } from 'src/store/commonActions';

describe('Test AnnotationDetailPanel reducer', () => {
  const state: AnnotationDetailPanelState = {
    categories: {
      [Categories.Asset]: { selected: true },
    },
  };
  const stateWithTwoCategories: AnnotationDetailPanelState = {
    categories: {
      [Categories.Asset]: { selected: true },
      [Categories.Text]: { selected: true },
    },
  };

  test('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(
      annotationDetailPanelInitialState
    );
  });

  describe('Test selectCategory reducer', () => {
    test('should select the category', () => {
      expect(
        reducer(
          annotationDetailPanelInitialState,
          selectCategory({ category: Categories.Asset, selected: true })
        )
      ).toEqual({ categories: { [Categories.Asset]: { selected: true } } });
    });
    test('should remove the category', () => {
      expect(
        reducer(
          state,
          selectCategory({ category: Categories.Asset, selected: false })
        )
      ).toEqual(annotationDetailPanelInitialState);
    });
    test('should add another selected category', () => {
      expect(
        reducer(
          state,
          selectCategory({ category: Categories.Text, selected: true })
        )
      ).toEqual(stateWithTwoCategories);
    });
    test('should not add same selected category', () => {
      expect(
        reducer(
          state,
          selectCategory({ category: Categories.Asset, selected: true })
        )
      ).toEqual(state);
    });
    test('do nothing on removing invalid category', () => {
      expect(
        reducer(
          state,
          selectCategory({ category: Categories.Text, selected: false })
        )
      ).toEqual(state);
    });
  });

  describe('Test extra reducers', () => {
    test('deselectAllSelectionsReviewPage', () => {
      const outputState = reducer(state, deselectAllSelectionsReviewPage);
      expect(outputState).toEqual(annotationDetailPanelInitialState);
    });
  });
});
